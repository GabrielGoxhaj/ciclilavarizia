using backend.DTOs.Auth;
using backend.DTOs.Customers;
using backend.DTOs.Response;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController: ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IAccountManager _accountManager;

        public AuthController(IAuthService authService, IAccountManager accountManager)
        {
            _authService = authService;
            _accountManager = accountManager;
        }


        //[HttpPost("register")]
        //public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        //{
        //    var response = await _authService.Register(dto);
        //    return Ok(response);
        //}

        [HttpPost("register")] 
        public async Task<ActionResult<ApiResponse<string>>> Register([FromBody] CustomerRegistrationDto dto)
        {
            var response = await _accountManager.RegisterUserAsync(dto);

            if (response.Status != "success")
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            var response = await _authService.Login(dto);
            return Ok(response);
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return Unauthorized();

            var userMe = new UserMeDto
            {
                Id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!),
                Username = User.Identity!.Name!,
                Email = User.FindFirstValue(ClaimTypes.Email)!,
                Role = User.FindFirstValue(ClaimTypes.Role)!
            };
            return Ok(ApiResponse<UserMeDto>.Success(userMe));
        }
    }
}
