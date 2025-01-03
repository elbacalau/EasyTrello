using backend.Data;
using Microsoft.EntityFrameworkCore;

using backend.src.Infrastructure.Mapper;
var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load("../.env");

builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = $"Server=localhost;Port=3306;Database={Environment.GetEnvironmentVariable("MYSQL_DATABASE")};" +
                           $"User={Environment.GetEnvironmentVariable("MYSQL_USER")};" +
                           $"Password={Environment.GetEnvironmentVariable("MYSQL_PASSWORD")};";
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 25)));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
