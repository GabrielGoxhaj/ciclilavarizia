using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
            
        }

        public DbSet<AppUser> Users { get; set; }
    }
}
