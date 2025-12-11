using backend.Data;
using backend.DTOs.Auth;
using backend.DTOs.Response;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;

namespace backend.Services
{
    public class AuthService
    {
        private readonly AuthDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AuthDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<ApiResponse<string>> Register(UserRegisterDto dto)
        {
            if(await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return ApiResponse<string>.Fail("Email already in use.");

            //CreatePasswordHash(dto.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var user = new AppUser 
           {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return ApiResponse<string>.Success("User registered");
        }
    }
}
