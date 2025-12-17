using AuthLibrary.Security;
using backend.Data;
using backend.Services;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Transactions;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // https://github.com/dotnet/runtime/issues/80777
            TransactionManager.ImplicitDistributedTransactions = true; // vedi link sopra

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Db Context
            builder.Services.AddDbContext<AdventureWorksLt2019Context>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddDbContext<AuthDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("AuthConnection")));


            builder.Services.AddScoped<JwtTokenGenerator>(sp =>
            {
                var config = sp.GetRequiredService<IConfiguration>();
                return new JwtTokenGenerator(
                    config["Jwt:Key"]!,
                    config["Jwt:Issuer"]!,
                    config["Jwt:Audience"]!
                );
            });

            // Registrazione dei servizi personalizzati
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<ICustomerService, CustomerService>();
            builder.Services.AddScoped<IProductService, ProductService>();
            builder.Services.AddScoped<IOrderCommandService, OrderService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IAccountManager, AccountManager>();
            

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
