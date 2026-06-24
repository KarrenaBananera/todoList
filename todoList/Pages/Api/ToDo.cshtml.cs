using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Security.Claims;
using todoList.Data;
using todoList.Models.DTOs;
using todoList.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace todoList.Pages.Api;

[Authorize]
public class ToDoModel : PageModel
{
    private readonly IToDoService _toDoService;

    public ToDoModel(IToDoService toDoService)
    {
        _toDoService = toDoService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnGetCountAsync(Status? filter = null)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var count = await _toDoService.GetTotalCountAsync(userId, filter);
        return new JsonResult(new { count });
    }

    public async Task<IActionResult> OnGetListAsync(int page = 1, int pageSize = 6, SortOrder sort = SortOrder.CreatedDesc, Status? filter = null)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var items = await _toDoService.GetTodosAsync(userId, page, pageSize, sort, filter);
        return new JsonResult(new { items });
    }

    public async Task<IActionResult> OnPostCreateAsync([FromBody] ToDoDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var created = await _toDoService.CreateAsync(dto, userId);
        return new JsonResult(created);
    }

    public async Task<IActionResult> OnPostUpdateAsync([FromBody] ToDoDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var success = await _toDoService.UpdateAsync(dto, userId);
        if (!success) return BadRequest("Update failed");

        return new JsonResult(new { success = true });
    }

    public async Task<IActionResult> OnPostDeleteAsync([FromBody] ToDoDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var success = await _toDoService.DeleteAsync(dto, userId);
        if (!success) return BadRequest("Delete failed");

        return new JsonResult(new { success = true });
    }
}
