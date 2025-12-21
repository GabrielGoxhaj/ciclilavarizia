using backend.Data;
using backend.DTOs.Auth;
using backend.DTOs.Response;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using System.Security.Claims;
using AuthLibrary.Security;
using backend.DTOs.Customers;


namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AuthDbContext _context;
        private readonly JwtTokenGenerator _tokenGenerator;

        public AuthService(AuthDbContext context, JwtTokenGenerator tokenGenerator)
        {
            _context = context;
            _tokenGenerator = tokenGenerator;
        }

        //public async Task<ApiResponse<string>> Register(UserRegisterDto dto)
        //{
        //    if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        //        return ApiResponse<string>.Fail("Email already in use.");

        //    PasswordHasher.CreateHash(dto.Password, out byte[] passwordHash, out byte[] passwordSalt);

        //    var user = new AppUser
        //    {
        //        Username = dto.Username,
        //        Email = dto.Email,
        //        PasswordHash = passwordHash,
        //        PasswordSalt = passwordSalt
        //    };

        //    _context.Users.Add(user);
        //    await _context.SaveChangesAsync();

        //    return ApiResponse<string>.Success("User registered");
        //}

        public async Task<int> CreateCredentialsAsync(CustomerRegistrationDto dto) // email e username univoci.
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("Email already exists in Security DB.");

            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                throw new Exception($"Username '{dto.Username}' already exists in Security DB.");

            PasswordHasher.CreateHash(dto.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var user = new AppUser
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(); // genera Id/FkUserLogins per collegamento tra i db CicliLavarizia e CicliLavariziaAuth

            return user.Id;
        }

        public async Task<ApiResponse<AuthResponseDto>> Login(UserLoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return ApiResponse<AuthResponseDto>.Fail("User not found");

            if (!PasswordHasher.Verify(dto.Password, user.PasswordHash, user.PasswordSalt))
                return ApiResponse<AuthResponseDto>.Fail("Invalid credentials");

            var token = _tokenGenerator.CreateToken(
                  user.Id,
                  user.Username,
                  user.Email,
                  user.Role
            );

            return ApiResponse<AuthResponseDto>.Success(
                new AuthResponseDto 
                { 
                    Token = token, 
                    Username = user.Username,
                    Role = user.Role
                },
                "Login successful"
            );
        }
    }
}
