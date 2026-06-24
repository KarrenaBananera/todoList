using Microsoft.AspNetCore.Identity;
using todoList.Services.Interfaces;

namespace todoList.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;

    public AuthService(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<IdentityResult> RegisterAsync(string email, string password)
    {
        var user = new IdentityUser
        {
            UserName = email,
            Email = email
        };

        return await _userManager.CreateAsync(user, password);
    }

    public async Task<SignInResult> LoginAsync(string email, string password, bool rememberMe)
    {
        // Require confirmed email is usually false by default, but password sign in handles it based on Identity options.
        return await _signInManager.PasswordSignInAsync(email, password, rememberMe, lockoutOnFailure: false);
    }

    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }
}
