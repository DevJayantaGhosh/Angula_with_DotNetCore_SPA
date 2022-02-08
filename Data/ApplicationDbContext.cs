using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NG_Core_Auth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NG_Core_Auth.Data
{
    public class ApplicationDbContext :IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> op):base(op)
        {

        }

        //create Role on model creation
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //IdentityRole Admin = new IdentityRole();
            //IdentityRole Customer = new IdentityRole();
            //IdentityRole Moderator = new IdentityRole();
            ////List<IdentityRole> roles = new List<IdentityRole> ();
            ////roles.Add(Admin);
            ////roles.Add(Customer);
            ////roles.Add(Moderator);
            ////builder.Entity<IdentityRole>().HasData(roles);


            List<IdentityRole> rolesAll = new()
            { 
                new IdentityRole { Id="1",Name="Admin",NormalizedName="ADMIN"}, 
                new IdentityRole{ Id="2",Name="Customer",NormalizedName="CUSTOMER"},
                new IdentityRole{ Id="3",Name="Moderator",NormalizedName="MODERATOR"} 
            };
            builder.Entity<IdentityRole>().HasData(rolesAll);
        }




        public DbSet<ProductModel> Products { get; set; }
     
    }
}
