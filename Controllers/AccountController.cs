using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NG_Core_Auth.Helpers;
using NG_Core_Auth.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace NG_Core_Auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        private readonly AppSettings _appsettngs;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager,IOptions<AppSettings> options)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._appsettngs =options.Value;
        }



        //Register
        [HttpPost("[action]")]
       
        public async Task<IActionResult> Register([FromBody]RegisterViewModel registerViewModel)
        {
            //storing all error
            List<string> errorList = new List<string>();
            IdentityUser user = new IdentityUser {
                Email = registerViewModel.Email,
                UserName = registerViewModel.UserName,
                SecurityStamp = Guid.NewGuid().ToString()
                
            };


            var res = await _userManager.CreateAsync(user, registerViewModel.Password);
            if (res.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Admin");
                return Ok(new { UserRegiNo = user.Id, Name = user.UserName, Emal = user.Email, Msg = "Regster Successfuly" });
            }
            else
            {
                foreach (var er in res.Errors)
                {
                    ModelState.AddModelError(er.Code, er.Description);
                    errorList.Add(er.Description);
                }
            }
            return BadRequest(new JsonResult(errorList));
            //sending Confirmation Email
        }


        [HttpPost]
        [Route("Userlogin")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel login)
        {
            //get User From D based on UserName

            var DBUser = await _userManager.FindByNameAsync(login.UserName);
            var DBRoles = await _userManager.GetRolesAsync(DBUser);
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appsettngs.Secret));
            double expireTime = Convert.ToDouble( _appsettngs.ExpireTime);
            if(DBUser!=null && await _userManager.CheckPasswordAsync(DBUser, login.Password))
            {
                //IsEmail Confirmed

                //Create Claim(k,v)
                Claim SubjectClaim = new Claim (JwtRegisteredClaimNames.Sub, login.UserName );
                Claim JTIClaim = new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString());
                Claim UserIDClaim = new Claim(ClaimTypes.NameIdentifier, login.UserName);
                Claim RoleCliam = new Claim(ClaimTypes.Role, DBRoles.FirstOrDefault());
                Claim LoggedOn = new Claim("LoggedOn", DateTime.Now.ToString());

                List<Claim> claims = new List<Claim> { SubjectClaim, JTIClaim, UserIDClaim, RoleCliam, LoggedOn };

                //Generate Token and send to client
                var TokenHandler = new JwtSecurityTokenHandler();
                var TokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),

                    //Must because we use this for validation in Startup.cs
                    SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256),
                    Issuer = _appsettngs.Site,
                    Audience = _appsettngs.Audience,
                    Expires = DateTime.Now.AddMinutes(expireTime)
                };

                var token = TokenHandler.CreateToken(TokenDescriptor);
                return Ok(new { Token = TokenHandler.WriteToken(token), ValidFrom = token.ValidFrom, ValidTo = token.ValidTo, Username = DBUser.UserName, Role = DBRoles.FirstOrDefault() });
            }
            ModelState.AddModelError("", "UserName/Password Not Valid");
            return Unauthorized(new { Mag = "UserName/Password Not Valid" });
        } 
    }
}
