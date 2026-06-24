using todoList.Data;
using todoList.Models.DTOs;

namespace todoList.Services.Interfaces;

public interface IToDoService
{
    Task<int> GetTotalCountAsync(string userId, Status? filterStatus = null);
    Task<List<ToDoDto>> GetTodosAsync(string userId, int page, int pageSize, SortOrder sortOrder, Status? filterStatus = null);
    Task<ToDoDto> CreateAsync(ToDoDto dto, string userId);
    Task<bool> UpdateAsync(ToDoDto dto, string userId);
    Task<bool> DeleteAsync(ToDoDto dto, string userId);
}
