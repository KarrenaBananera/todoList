using Microsoft.AspNetCore.Identity;

namespace todoList.Services.Interfaces;

public interface IAuthService
{
    Task<IdentityResult> RegisterAsync(string email, string password);
    Task<SignInResult> LoginAsync(string email, string password, bool rememberMe);
    Task LogoutAsync();
}
