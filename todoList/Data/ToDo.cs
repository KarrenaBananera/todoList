using Microsoft.AspNetCore.Identity;

namespace todoList.Data;

public class ToDo
{
    public int Id { get; set; }
    public string UserId { get; set; } 
    public DateTime Created { get; set; }
    public DateOnly Finish { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public Status Status { get; set; }
    public IdentityUser User { get; set; }

}
public enum Status
{
    ToDo, Done, InProgress
}
