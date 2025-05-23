using backend.Data;
using Microsoft.EntityFrameworkCore;

using backend.src.Infrastructure.Mapper;
using backend.src.Middelware;
using backend.src.Service;
using backend.src.Infrastructure.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.src.Middleware;
using Microsoft.OpenApi.Models;
var builder = WebApplication.CreateBuilder(args);



DotNetEnv.Env.Load("../.env");

builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Introduce el token JWT con el prefijo 'Bearer '. Ejemplo: Bearer {token}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


// register services
builder.Services.AddScoped<Functions>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthHelper>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<BoardService>();
builder.Services.AddScoped<RoleValidationAttribute>();
builder.Services.AddScoped<TaskService>();
builder.Services.AddScoped<TaskCommentService>();
builder.Services.AddScoped<backend.src.Services.PermissionService>();
builder.Services.AddScoped<backend.src.Services.DbInitializerService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = $"Server=localhost;Port=3306;Database={Environment.GetEnvironmentVariable("MYSQL_DATABASE")};" +
                           $"User={Environment.GetEnvironmentVariable("MYSQL_USER")};" +
                           $"Password={Environment.GetEnvironmentVariable("MYSQL_PASSWORD")};";
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 25)));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policyBuilder =>
    {
        policyBuilder
            .WithOrigins("http://localhost:3000", "http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});



// authentication
builder.Services.AddAuthentication(cfg =>
{
    cfg.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    cfg.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    cfg.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = false;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET")!)
        ),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero,
        RequireExpirationTime = true
    };

    x.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Cookies["accessToken"];
            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});



var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}




// middlewares              
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();


app.UseMiddleware<ExceptionHandlingMiddleware>();

// inicializar permisos
using (var scope = app.Services.CreateScope())
{
    var dbInitializer = scope.ServiceProvider.GetRequiredService<backend.src.Services.DbInitializerService>();
    await dbInitializer.InitializePermissionsAsync();
}

app.MapControllers();
app.Run();
