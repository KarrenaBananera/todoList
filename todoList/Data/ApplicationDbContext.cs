using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace todoList.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public DbSet<ToDo> ToDos { get; set; }
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
       : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);     

        modelBuilder.Entity<ToDo>(entity =>
        {
            entity.HasKey(t => t.Id);

            entity.HasOne(t => t.User)
                  .WithMany() 
                  .HasForeignKey(t => t.UserId)
                  .OnDelete(DeleteBehavior.Cascade); 

            entity.Property(t => t.Id)
                  .ValueGeneratedOnAdd();
        });
    }
}
