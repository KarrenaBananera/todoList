using todoList.Data;

namespace todoList.Models.DTOs;

public class ToDoDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public Status Status { get; set; }
    public DateTime Created { get; set; }
    public DateOnly Finish { get; set; }
}
