# WEB
* Toàn bộ thông tin, quá trình lập trình, thiết kế, làm việc sẽ được lưu tại đây
## 16/03/2025
### Đã làm được 
* Chỉnh sửa phần User Controller
* Hoàn thiện thêm code của File service, với Permission, Role
* Code các chức năng cho Permission, Role (thêm, xoá, xem toàn bộ)
* Xử lý các exception thông qua code file exception
* Thêm repository (RoleRepository, PermissionRepository)
* Hoàn thiện DTO (Data transfer Object)
* Thêm Validator cho xử lý exception về độ tuổi (Thuận tiện hoá thay đổi độ tuổi xử lý)
### Chưa làm được
* Chức năng login, logout do chưa đủ thời gian
### Dự kiến tương lai
* Thực hiện chức năng login/logout và tiếp tục code tiếp backend, sau đó sẽ code frontend


## 23/03/2025
### Đã làm được
* Merge code, xử lý xung đột code 2 người back end
* Bước đầu code login, logout

### Chưa làm được
* Chưa xong login logout (Do chưa có thời gian, làm muộn)

### Dự kiến tương lai
* Hoàn thiện login, logout trong tuần tới

## 30/03/2025
### Đã làm được 
* Code xong phần ConFigure cho code
  * Điều chỉnh việc thêm tài khoản admin khi chưa có
  * Xử lý các request chưa được xác thực
  * Hoàn thiện phần login/logout
* Hoàn thiện phần controller, phần code đã ổn định với việc quản lý tài khoản

### Chưa làm được
* Trong quá trình chạy lại để kiểm tra, lại phát sinh lỗi 
  * Mặc dù run được, nhưng các request đều bị lỗi Unauthorized!
* Nguyên nhân vẫn đang tìm kiếm, nhưng đây có thể là lỗi về mặt phân quyền

### Dự kiến tương lai
* Sửa lỗi đang mắc phải
* Phát triển tiếp phần Front End
* Tìm hiểu RAG