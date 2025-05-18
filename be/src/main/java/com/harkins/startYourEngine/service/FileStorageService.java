package com.harkins.startYourEngine.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
    private final Path rootLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Không thể tạo thư mục upload", e);
        }
    }

    public String storeFile(MultipartFile file, String oldImagePath) {
        try {
            // Case 1: Không có file mới
            if (file == null || file.isEmpty()) {
                if (oldImagePath == null || oldImagePath.isEmpty()) {
                    return ""; // Trả về chuỗi rỗng thay vì null
                }
                return oldImagePath; // Giữ nguyên ảnh cũ nếu là update
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Only image files are allowed");
            }

            // Validate file size (giới hạn 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                throw new RuntimeException("File size exceeds the limit (5MB)");
            }

            // Generate unique filename
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String uniqueFileName = timeStamp + "_" + UUID.randomUUID().toString() + "_" + fileName;

            // Use configured path
            LocalDate today = LocalDate.now();
            Path dailyDir = rootLocation.resolve(today.toString());

            // Create directory if not exists
            if (!Files.exists(dailyDir)) {
                Files.createDirectories(dailyDir);
            }

            // Delete old image if exists
            if (oldImagePath != null && !oldImagePath.isEmpty()) {
                try {
                    deleteFile(oldImagePath);
                } catch (Exception ex) {
                    // Log error but continue with saving new file
                    System.err.println("Warning: Failed to delete old image: " + ex.getMessage());
                }
            }

            // Save new file
            Path filePath = dailyDir.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return relative path for database storage
            String relativePath = "/uploads/" + today + "/" + uniqueFileName;
            return relativePath;
        } catch (IOException e) {
            throw new RuntimeException("Could not store the file. IO Error: " + e.getMessage(), e);
        } catch (RuntimeException e) {
            throw e; // Rethrow runtime exceptions
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error storing file: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String imagePath) {
        // Skip if image path is null or empty
        if (imagePath == null || imagePath.isEmpty()) {
            return;
        }

        try {
            // Ensure path starts with / and remove it
            String normalizedPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
            Path file = rootLocation.resolve(normalizedPath);

            if (Files.exists(file)) {
                Files.delete(file);
                System.out.println("Successfully deleted file: " + imagePath);
            } else {
                System.out.println("File not found for deletion: " + imagePath);
            }
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + imagePath + ", error: " + e.getMessage());
            // Don't throw exception to prevent disrupting the update process
        }
    }
}
