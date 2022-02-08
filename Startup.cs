using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using NG_Core_Auth.Data;
using NG_Core_Auth.Helpers;
using System.Text;

namespace NG_Core_Auth
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });


            //User CORS -----1
            //services.AddCors(op =>
            //{
            //    op.AddPolicy("EnableCORS", builder =>
            //    {
            //        builder.SetIsOriginAllowed(_ => true).AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().AllowCredentials().Build();
            //    });

            //});

            //SetUp Database or DataContext-----2
            services.AddDbContext<ApplicationDbContext>(op =>
            {
                op.UseSqlServer(Configuration.GetConnectionString("StringDatabase"));
            });

            //User Identity and  ValidationRule Options      How to Validate User? see options
            //Store is type of ApplicationDBContext/or OtherDBContext if you want ------3
            services.AddIdentity<IdentityUser, IdentityRole>(options=>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.User.RequireUniqueEmail = true;

                options.Lockout.DefaultLockoutTimeSpan = System.TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;


            })
            .AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();



            //AppSettingSection ---> AppSettings
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);
            var appSettingValues = appSettingsSection.Get<AppSettings>();

            //service <--------- Configuration<Class> <------- section
            //services.Configure<AppSettings>(appSettingsSection);
            //var appS = Configuration.GetSection("AppSettings").Get<AppSettings>();


            var key = Encoding.ASCII.GetBytes(appSettingValues.Secret);

            //JWT Athentication  How to validate ? see AddJwtBearer()
            services.AddAuthentication(o=>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme,o=>
            {
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    //validate based on 
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                   

                    //validate with
                    ValidIssuer = appSettingValues.Site,
                    ValidAudience = appSettingValues.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    

                    
                };
            });



            services.AddAuthorization(option =>
            {
                option.AddPolicy("RequireLogedIn", policy => { policy.RequireRole("Customer", "Admin", "Moderator").RequireAuthenticatedUser(); });
                option.AddPolicy("IsAdmin", policy => { policy.RequireAuthenticatedUser().RequireRole("Admin"); });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            //app.UseCors("EnableCORS");

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseAuthentication();
           
           
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
