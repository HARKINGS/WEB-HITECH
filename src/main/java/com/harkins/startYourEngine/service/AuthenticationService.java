package com.harkins.startYourEngine.service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.harkins.startYourEngine.dto.request.AuthenticationRequest;
import com.harkins.startYourEngine.dto.request.IntrospectRequest;
import com.harkins.startYourEngine.dto.request.LogoutRequest;
import com.harkins.startYourEngine.dto.request.RefreshRequest;
import com.harkins.startYourEngine.dto.response.AuthenticationResponse;
import com.harkins.startYourEngine.dto.response.IntrospectResponse;
import com.harkins.startYourEngine.entity.InvalidatedToken;
import com.harkins.startYourEngine.entity.User;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.repository.InvalidatedTokenRepository;
import com.harkins.startYourEngine.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    // Kiểm tra token đưa vào có hợp lệ không
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException e) {
            // Valid không đúng (false)
            isValid = false;
        }

        // Nếu như cái token bị lỗi thì sẽ được xử lý ở hàm verifyToken, nên khi return ở đây, valid tức hợp lệ là đúng
        return IntrospectResponse.builder().valid(isValid).build();
    }

    // Đưa ra token khi đăng nhập thành công
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) // ko đăng nhập thành công
        throw new AppException(ErrorCode.UNAUTHENTICATED);

        String token = generateToken(user);

        return AuthenticationResponse.builder().authenticated(true).token(token).build();
    }

    // Đưa ra token khi đăng xuất thành công
    public void logout(LogoutRequest request) throws JOSEException, ParseException {
        try {
            var signToken = verifyToken(request.getToken(), true);

            // khi signout vẫn cần check theo thời gian của refreshToken
            // vì có thể có trường hợp token hết hạn nhưng vẫn còn trong tập token hợp lệ
            // nếu token hết hạn / không hợp lệ thì không cần logout

            // trong code, nếu token hợp lệ thì sẽ được logout
            // nếu ko hợp lệ, sẽ bắn ra exception và không cần logout
            // điều này dẫn tới token không hợp lệ sẽ không bị logout
            // nếu muốn logout token không hợp lệ, ta cần thêm một cơ chế khác để logout token

            // cho nên cần phải thay đổi isRefresh thành true để verify token theo thời gian của refreshToken
            // nếu token hợp lệ thì vẫn đẩy xuống invalidatedTokenRepository

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken =
                    InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException exception) {
            // Token không hợp lệ, không cần logout
            log.info("Token is already expired or invalid");
            return;
        }
    }

    // Kiểm tra token có hợp lệ không
    // Token hợp lệ khi chữ ký đúng và thời gian hết hạn sau thời gian hiện tại
    // Token không hợp lệ khi chữ ký sai hoặc thời gian hết hạn trước thời gian hiện tại
    // Token không hợp lệ khi token đã được logout
    // isRefresh: true nếu token phải refresh, false thì hàm verify dùng để kiểm tra(authenticate, introspect) token
    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                        .getJWTClaimsSet()
                        .getIssueTime()
                        .toInstant()
                        .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                        .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        // hàm verify kiểm tra chữ ký của token có đúng không
        var verified = signedJWT.verify(verifier);

        // Token hết hạn hoặc không được chấp nhận (Bị sửa đổi, chữ ký ko đúng)
        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        // Token đã xuất hiện trong tập Token ko hợp lệ (Tức là tk đã logout) thì token này sẽ là invalid
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    // Refresh token
    // Khi token hết hạn, ta có thể tạo một token mới bằng cách sử dụng token cũ
    // Token mới sẽ có thời gian hết hạn mới, thông tin người dùng không thay đổi
    public AuthenticationResponse refreshToken(RefreshRequest request) throws JOSEException, ParseException {
        // Kiểm tra hiệu lực Token
        SignedJWT signToken = verifyToken(request.getToken(), true);

        // Thực hiện refresh token (Tạo token mới) bằng cách sử dụng thông tin từ token cũ
        String jit = signToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

        // Set up Token mới
        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

        invalidatedTokenRepository.save(invalidatedToken);

        // Issue 1 token mới
        // username nằm trong subject của token, do đó ta có thể lấy username từ subject
        String username = signToken.getJWTClaimsSet().getSubject();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String token = generateToken(user);
        return AuthenticationResponse.builder().authenticated(true).token(token).build();
    }

    private String generateToken(User user) {
        // Phần header
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        // Phần body, data trong body được gọi là claims, tập data của body gọi là JWTClaimsSet
        // Với builder, ta có thể thêm các thông tin vào body
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername()) // Subject là username của user
                .issuer("Harkins") // Issuer là tên của ứng dụng
                .issueTime(new Date()) // Issue time là thời gian tạo token
                .expirationTime(
                        new Date( // Expiration time là thời gian token hết hạn
                                Instant.now()
                                        .plus(
                                                VALID_DURATION,
                                                ChronoUnit.SECONDS) // Thời gian hết hạn sau VALID_DURATION giây
                                        .toEpochMilli()
                                // Token không bao giờ hết hạn,
                                // nếu giá trị trọng ngoặc khác null thì token sẽ hết hạn sau thời gian đó
                                ))
                .jwtID(UUID.randomUUID().toString()) // set token ID là 1 UUID
                .claim(
                        "scope",
                        buildScope(user)) // Claim là một cặp key-value, ở đây key là customClaim, value là Custom
                .build();

        // Payload là phần data của body, chuyển từ dạng JWTClaimsSet sang dạng JSON
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            // Ký token bằng một key, ở đây sử dụng MACSigner với key là một chuỗi bất kỳ
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException ex) {
            log.error("Cannot create token", ex);
            throw new RuntimeException(ex);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                /// Role không rỗng Permissions
                if (!CollectionUtils.isEmpty(role.getPermissions()))
                    role.getPermissions().forEach(permission -> {
                        stringJoiner.add(permission.getName());
                    });
            });

        return stringJoiner.toString();
    }
}
