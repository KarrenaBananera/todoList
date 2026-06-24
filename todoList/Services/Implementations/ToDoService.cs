using Microsoft.EntityFrameworkCore;
using todoList.Data;
using todoList.Models.DTOs;
using todoList.Services.Interfaces;

namespace todoList.Services.Implementations;

public class ToDoService : IToDoService
{
    private readonly ApplicationDbContext _context;

    public ToDoService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetTotalCountAsync(string userId, Status? filterStatus = null)
    {
        var query = _context.ToDos.Where(t => t.UserId == userId);
        
        if (filterStatus.HasValue)
        {
            query = query.Where(t => t.Status == filterStatus.Value);
        }

        return await query.CountAsync();
    }

    public async Task<List<ToDoDto>> GetTodosAsync(string userId, int page, int pageSize, SortOrder sortOrder, Status? filterStatus = null)
    {
        var query = _context.ToDos.Where(t => t.UserId == userId);
        
        if (filterStatus.HasValue)
        {
            query = query.Where(t => t.Status == filterStatus.Value);
        }

        query = sortOrder switch
        {
            SortOrder.CreatedAsc => query.OrderBy(t => t.Created),
            SortOrder.DueAsc => query.OrderBy(t => t.Finish),
            SortOrder.DueDesc => query.OrderByDescending(t => t.Finish),
            _ => query.OrderByDescending(t => t.Created)
        };

        var todos = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new ToDoDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Created = t.Created,
                Finish = t.Finish
            })
            .ToListAsync();

        return todos;
    }

    public async Task<ToDoDto> CreateAsync(ToDoDto dto, string userId)
    {
        var todo = new ToDo
        {
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            Created = DateTime.Now,
            Finish = dto.Finish,
            UserId = userId
        };



        _context.ToDos.Add(todo);
        await _context.SaveChangesAsync();

        dto.Id = todo.Id;
        dto.Created = todo.Created;
        return dto;
    }

    public async Task<bool> UpdateAsync(ToDoDto dto, string userId)
    {
        var todo = await _context.ToDos.FirstOrDefaultAsync(t => t.Id == dto.Id && t.UserId == userId);
        if (todo == null)
        {
            return false;
        }

        todo.Title = dto.Title;
        todo.Description = dto.Description;
        todo.Status = dto.Status;

        todo.Finish = dto.Finish;

        _context.ToDos.Update(todo);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(ToDoDto dto, string userId)
    {
        var todo = await _context.ToDos.FirstOrDefaultAsync(t => t.Id == dto.Id && t.UserId == userId);
        if (todo == null)
        {
            return false;
        }

        _context.ToDos.Remove(todo);
        await _context.SaveChangesAsync();
        return true;
    }
}
