using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using todoList.Pages.Shared;

namespace todoList.Pages;

public class LoginModel : GuestOnlyPage
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;

    public LoginModel(SignInManager<IdentityUser> signInManager,
                      UserManager<IdentityUser> userManager
                      )
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [BindProperty]
    public InputModel Input { get; set; }

    public string ReturnUrl { get; set; }

    public class InputModel
    {
        [Required(ErrorMessage = "Email required")]
        [EmailAddress(ErrorMessage = "Wrong email format")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password required")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Display(Name = "Remember me")]
        public bool RememberMe { get; set; }
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
            return Page();
            
        var result = await _signInManager.PasswordSignInAsync(Input.Email, Input.Password, Input.RememberMe, lockoutOnFailure: true);
        
        if (result.Succeeded)
            return RedirectToPage("Index");
            
        AddModelErrors(result);
        return Page();
    }

    private void AddModelErrors(Microsoft.AspNetCore.Identity.SignInResult result)
    {
        if (result.IsLockedOut)
            ModelState.AddModelError(string.Empty, "Too many login attempts");
        else if (result.IsNotAllowed)
            ModelState.AddModelError(string.Empty, "User is not allowed to sign in");
        else
            ModelState.AddModelError(string.Empty, "Incorrect email or password");
    }
}