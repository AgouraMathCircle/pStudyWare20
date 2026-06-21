using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using pStudyWare20.Entity;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Services.Implementations;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Repository.Implementations;
using pStudyWare20.Data.Models;
using System.Text;
using System.Reflection;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Add HttpContextAccessor for IP address tracking
builder.Services.AddHttpContextAccessor();

// Configure CORS - More permissive for testing
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("X-Document-File-Path");
    });

    // Add a default policy for all origins
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("X-Document-File-Path");
    });

    // Add a policy for specific origins (used by controllers that require credentials)
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()
                  .WithExposedHeaders("X-Document-File-Path");
        }
        else
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .WithExposedHeaders("X-Document-File-Path");
        }
    });
});

// Configure JWT Settings
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings?.SecretKey ?? "default-key")),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings?.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtSettings?.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2),
            // Map role claim correctly for authorization
            // JWT tokens typically use "role" as the claim name
            RoleClaimType = "role",
            NameClaimType = System.Security.Claims.ClaimTypes.NameIdentifier
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices
                    .GetRequiredService<ILoggerFactory>()
                    .CreateLogger("JwtBearer");
                logger.LogWarning(
                    context.Exception,
                    "JWT authentication failed for {Method} {Path}. AuthorizationRequired={AuthorizationRequired}",
                    context.Request.Method,
                    context.Request.Path,
                    context.HttpContext.GetEndpoint()?.Metadata.GetMetadata<IAuthorizeData>() != null);
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                var logger = context.HttpContext.RequestServices
                    .GetRequiredService<ILoggerFactory>()
                    .CreateLogger("JwtBearer");
                logger.LogWarning(
                    "JWT challenge returned 401 for {Method} {Path}. Error={Error} ErrorDescription={ErrorDescription}",
                    context.Request.Method,
                    context.Request.Path,
                    context.Error,
                    context.ErrorDescription);
                return Task.CompletedTask;
            },
        };
    });

// Configure Authorization
builder.Services.AddAuthorization(options =>
{
    // Configure role-based authorization policies
    options.AddPolicy("Student", policy => policy.RequireRole("Student"));
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("Instructor", policy => policy.RequireRole("Instructor"));
    options.AddPolicy("Volunteer", policy => policy.RequireRole("Volunteer"));
});

// Configure DbContext
builder.Services.AddDbContext<AMC_DBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Repositories
builder.Services.AddScoped<IMemberRepository, MemberRepository>();
builder.Services.AddScoped<IVolunteerRepository, VolunteerRepository>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<ITimesheetRepository, TimesheetRepository>();
builder.Services.AddScoped<IFinalExamRepository, FinalExamRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IInstructorDashboardRepository, InstructorDashboardRepository>();
builder.Services.AddScoped<IMeetingDetailsRepository, MeetingDetailsRepository>();
builder.Services.AddScoped<IInstructorRepository, InstructorRepository>();
builder.Services.AddScoped<IOnlineExamRepository, OnlineExamRepository>();
builder.Services.AddScoped<IStudentScoreRepository, StudentScoreRepository>();
builder.Services.AddScoped<IPostMessageRepository, PostMessageRepository>();
builder.Services.AddScoped<ISentEmailRepository, SentEmailRepository>();
builder.Services.AddScoped<IRegisteredStudentListRepository, RegisteredStudentListRepository>();
builder.Services.AddScoped<IStudentWaitingListRepository, StudentWaitingListRepository>();
builder.Services.AddScoped<IVolunteersRequestRepository, VolunteersRequestRepository>();
builder.Services.AddScoped<IReportCardRepository, ReportCardRepository>();
builder.Services.AddScoped<ISpecialEventsRegistrationRepository, SpecialEventsRegistrationRepository>();
builder.Services.AddScoped<ITimeSheetTrackingRepository, TimeSheetTrackingRepository>();
builder.Services.AddScoped<IVolunteerDashboardRepository, VolunteerDashboardRepository>();
builder.Services.AddScoped<IDonateRepository, DonateRepository>();
builder.Services.AddScoped<IStudentDashboardRepository, StudentDashboardRepository>();
builder.Services.AddScoped<IEmailManagerRepository, EmailManagerRepository>();
builder.Services.AddScoped<ISemesterLookupRepository, SemesterLookupRepository>();

// Register Services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IVolunteerService, VolunteerService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<ITimesheetService, TimesheetService>();
builder.Services.AddScoped<IFinalExamService, FinalExamService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IInstructorDashboardService, InstructorDashboardService>();
builder.Services.AddScoped<IMeetingDetailsService, MeetingDetailsService>();
builder.Services.AddScoped<IInstructorService, InstructorService>();
builder.Services.AddScoped<IOnlineExamService, OnlineExamService>();
builder.Services.AddScoped<IStudentScoreService, StudentScoreService>();
builder.Services.AddScoped<IPostMessageService, PostMessageService>();
builder.Services.AddScoped<ISentEmailService, SentEmailService>();
builder.Services.AddScoped<IRegisteredStudentListService, RegisteredStudentListService>();
builder.Services.AddScoped<IStudentWaitingListService, StudentWaitingListService>();
builder.Services.AddScoped<IVolunteersRequestService, VolunteersRequestService>();
builder.Services.AddScoped<IReportCardService, ReportCardService>();
builder.Services.AddScoped<ISpecialEventsRegistrationService, SpecialEventsRegistrationService>();
builder.Services.AddScoped<ITimeSheetTrackingService, TimeSheetTrackingService>();
builder.Services.AddScoped<IVolunteerDashboardService, VolunteerDashboardService>();
builder.Services.AddScoped<IDonateService, DonateService>();
builder.Services.AddScoped<IStudentDashboardService, StudentDashboardService>();
builder.Services.AddScoped<IEmailUtility, EmailUtility>();
builder.Services.AddScoped<IEmailManagerService, EmailManagerService>();
builder.Services.AddScoped<ISemesterLookupService, SemesterLookupService>();

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "pStudyWare20 API",
        Version = "v1",
        Description = "API for pStudyWare20 - Student Registration, Authentication, Donor Management, and Volunteer Management System",
        Contact = new OpenApiContact
        {
            Name = "pStudyWare20 Team",
            Email = "support@pstudyware.com"
        },
        License = new OpenApiLicense
        {
            Name = "MIT License",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });

    // Configure JWT authentication for Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
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
            new string[] {}
        }
    });

    // Include XML comments if available
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }

    // Group endpoints by controller
    c.TagActionsBy(api =>
    {
        if (api.GroupName != null)
        {
            return new[] { api.GroupName.ToString() };
        }

        var controllerActionDescriptor = api.ActionDescriptor as Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor;
        if (controllerActionDescriptor != null)
        {
            return new[] { controllerActionDescriptor.ControllerName };
        }

        return new[] { "Default" };
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// Enable Swagger in all environments for easier testing
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "pStudyWare20 API v1");
    c.RoutePrefix = "swagger";
    c.DocumentTitle = "pStudyWare20 API Documentation";
    c.DefaultModelsExpandDepth(2);
    c.DefaultModelExpandDepth(2);
    c.DisplayRequestDuration();
    c.EnableDeepLinking();
    c.EnableFilter();
});

app.UseHttpsRedirection();

// Use CORS before Authentication and Authorization
// Use default policy which allows all origins, or use specific policy
app.UseCors(); // This uses the default policy (AllowAnyOrigin)

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
