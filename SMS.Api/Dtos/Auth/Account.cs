namespace SMS.Api.Dtos;

public record VerificationCode(string Code);

public record UserEmail(string Email);

public record ChangePasswordPayload(string CurrentPassword, string NewPassword);

public record ResetPasswordPayload(string Password, string Email, string Token);

public record ForgotPasswordPayload(string email);

public record LoginRes(bool IsSuccess, bool? NeedVerification = false, bool? IsLockedOut = false);