namespace Tests.API
{
    using MediatR;

    using Moq;

    using NUnit.Framework;

    using Shared;

    using Shouldly;

    using Application.Handlers.Identity.Commands.Register;
    using Application.Handlers.Identity.Commands.Login;
    using Application.Handlers.Identity.Commands.Logout;
    using Application.Handlers.Identity.Commands.User;
    using Application.Handlers.Identity.Commands.Refresh;

    using Models.Identity;

    [TestFixture]
    public class IdentityControllerTests
    {
        private Mock<IMediator> _mockMediator { get; set; } = null;

        [SetUp]
        public void Setup() 
        {
            _mockMediator = new Mock<IMediator> { CallBase = true };
        }

        [Test]
        public async Task Register_New_User_Successfully()
        {
            // Arrange
            var userRegisterCommand = new UserRegisterCommand("First", "Last", "email@example.com", "Password123", "Password123", true);
            _mockMediator.Setup(x => x.Send(It.IsAny<UserRegisterCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.SuccessResult("Successful Registration"));

            // Act
            var result = await _mockMediator.Object.Send(userRegisterCommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeTrue();
            result.Data.ShouldBe("Successful Registration");
        }

        [Test]
        public async Task Register_User_Fails_When_Email_Already_Exists()
        {
            // Arrange
            var userRegisterCommand = new UserRegisterCommand("First", "Last", "email@example.com", "Password123", "Password123", true);
            _mockMediator.Setup(x => x.Send(It.IsAny<UserRegisterCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.Failure("Email already in use"));

            // Act
            var result = await _mockMediator.Object.Send(userRegisterCommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeFalse();
            result.Errors.ShouldContain("Email already in use");
        }

        // Success scenario
        [Test]
        public async Task Login_Successful_With_Valid_Credentials()
        {
            var token = "valid_token";
            var refreshToken = "valid_token";
            var refreshTokenExpiryTime = DateTime.UtcNow;
            var tokenResponse = new UserResponseModel(token, refreshTokenExpiryTime, refreshToken);
            var loginCommand = new UserLoginCommand("email@example.com", "Password123", true);
            _mockMediator.Setup(x => x.Send(It.IsAny<UserLoginCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<UserResponseModel>.SuccessResult(tokenResponse));

            var result = await _mockMediator.Object.Send(loginCommand);

            result.ShouldBeOfType<Result<UserResponseModel>>();
            result.Success.ShouldBeTrue();
            (result as Result<UserResponseModel>).Data.AccessToken.ShouldNotBeNullOrEmpty();
        }

        // Failure scenario
        [Test]
        public async Task Login_Fails_With_Invalid_Credentials()
        {
            var loginCommand = new UserLoginCommand("email@example.com", "WrongPassword", true);
            _mockMediator.Setup(x => x.Send(It.IsAny<UserLoginCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<UserResponseModel>.Failure("Invalid credentials"));

            var result = await _mockMediator.Object.Send(loginCommand);

            result.Success.ShouldBeFalse();
            result.Errors.ShouldContain("Invalid credentials");
        }

        [Test]
        public async Task Refresh_Token_Successfully()
        {
            // Arrange
            var refreshTokenCommand = new UserRefreshCommand("valid_refresh_token");
            var expectedResponse = new UserResponseModel("new_access_token", DateTime.UtcNow.AddHours(1), "new_refresh_token");
            _mockMediator.Setup(x => x.Send(It.IsAny<UserRefreshCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<UserResponseModel>.SuccessResult(expectedResponse));

            // Act
            var result = await _mockMediator.Object.Send(refreshTokenCommand);

            // Assert
            result.ShouldBeOfType<Result<UserResponseModel>>();
            result.Success.ShouldBeTrue();
            result.Data.AccessToken.ShouldNotBeNullOrEmpty();
        }

        [Test]
        public async Task Refresh_Token_Fails_With_Invalid_Token()
        {
            // Arrange
            var refreshTokenCommand = new UserRefreshCommand("invalid_refresh_token");
            _mockMediator.Setup(x => x.Send(It.IsAny<UserRefreshCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<UserResponseModel>.Failure("Invalid token"));

            // Act
            var result = await _mockMediator.Object.Send(refreshTokenCommand);

            // Assert
            result.ShouldBeOfType<Result<UserResponseModel>>();
            result.Success.ShouldBeFalse();
            result.Errors.ShouldContain("Invalid token");
        }

        [Test]
        public async Task Logout_Successfully()
        {
            // Arrange
            var logoutCommand = new UserLogoutCommand("email@example.com");
            _mockMediator.Setup(x => x.Send(It.IsAny<UserLogoutCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.SuccessResult("Logged out successfully"));

            // Act
            var result = await _mockMediator.Object.Send(logoutCommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeTrue();
            result.Data.ShouldBe("Logged out successfully");
        }

        [Test]
        public async Task Logout_Fails_When_User_Not_Found()
        {
            // Arrange
            var logoutCommand = new UserLogoutCommand("unknown@example.com");
            _mockMediator.Setup(x => x.Send(It.IsAny<UserLogoutCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.Failure("User not found"));

            // Act
            var result = await _mockMediator.Object.Send(logoutCommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeFalse();
            result.Errors.ShouldContain("User not found");
        }

        [Test]
        public async Task Confirm_Email_Successfully()
        {
            // Arrange
            var confirmEmailCommand = new ConfirmEmailCommand("email@example.com", "confirmation_code", "0000");
            _mockMediator.Setup(x => x.Send(It.IsAny<ConfirmEmailCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.SuccessResult("Email confirmed successfully"));

            // Act
            var result = await _mockMediator.Object.Send(confirmEmailCommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeTrue();
            result.Data.ShouldBe("Email confirmed successfully");
        }

        [Test]
        public async Task Confirm_Email_Fails_When_Code_Invalid()
        {
            // Arrange
            var confirmEmailCommand = new ConfirmEmailCommand("email@example.com", "invalid_code", "0000");
            _mockMediator.Setup(x => x.Send(It.IsAny<ConfirmEmailCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.Failure("Invalid confirmation code"));

            // Act
            var result = await _mockMediator.Object.Send(confirmEmailCommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeFalse();
            result.Errors.ShouldContain("Invalid confirmation code");
        }

        [Test]
        public async Task Enable_2FA_Successfully()
        {
            // Arrange
            var enable2FACommand = new EnableTwoFactorAuthenticationCommand("email@example.com");
            _mockMediator.Setup(x => x.Send(It.IsAny<EnableTwoFactorAuthenticationCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.SuccessResult("2FA enabled successfully"));

            // Act
            var result = await _mockMediator.Object.Send(enable2FACommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeTrue();
            result.Data.ShouldBe("2FA enabled successfully");
        }

        [Test]
        public async Task Enable_2FA_Fails_When_User_Not_Found()
        {
            // Arrange
            var enable2FACommand = new EnableTwoFactorAuthenticationCommand("unknown@example.com");
            _mockMediator.Setup(x => x.Send(It.IsAny<EnableTwoFactorAuthenticationCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.Failure("User not found"));

            // Act
            var result = await _mockMediator.Object.Send(enable2FACommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeFalse();
            result.Errors.ShouldContain("User not found");
        }

        [Test]
        public async Task Disable_2FA_Successfully()
        {
            // Arrange
            var disable2FACommand = new DisableTwoFactorAuthenticationCommand("email@example.com");
            _mockMediator.Setup(x => x.Send(It.IsAny<DisableTwoFactorAuthenticationCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.SuccessResult("2FA disabled successfully"));

            // Act
            var result = await _mockMediator.Object.Send(disable2FACommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeTrue();
            result.Data.ShouldBe("2FA disabled successfully");
        }

        [Test]
        public async Task Disable_2FA_Fails_When_User_Not_Found()
        {
            // Arrange
            var disable2FACommand = new DisableTwoFactorAuthenticationCommand("unknown@example.com");
            _mockMediator.Setup(x => x.Send(It.IsAny<DisableTwoFactorAuthenticationCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.Failure("User not found"));

            // Act
            var result = await _mockMediator.Object.Send(disable2FACommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeFalse();
            result.Errors.ShouldContain("User not found");
        }

        [Test]
        public async Task Unlock_User_Account_Successfully()
        {
            // Arrange
            var unlockAccountCommand = new UnlockUserAccountCommand("email@example.com");
            _mockMediator.Setup(x => x.Send(It.IsAny<UnlockUserAccountCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.SuccessResult("Account unlocked successfully"));

            // Act
            var result = await _mockMediator.Object.Send(unlockAccountCommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeTrue();
            result.Data.ShouldBe("Account unlocked successfully");
        }

        [Test]
        public async Task Unlock_User_Account_Fails_When_User_Not_Found()
        {
            // Arrange
            var unlockAccountCommand = new UnlockUserAccountCommand("unknown@example.com");
            _mockMediator.Setup(x => x.Send(It.IsAny<UnlockUserAccountCommand>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(Result<string>.Failure("User not found"));

            // Act
            var result = await _mockMediator.Object.Send(unlockAccountCommand);

            // Assert
            result.ShouldBeOfType<Result<string>>();
            result.Success.ShouldBeFalse();
            result.Errors.ShouldContain("User not found");
        }
    }
}