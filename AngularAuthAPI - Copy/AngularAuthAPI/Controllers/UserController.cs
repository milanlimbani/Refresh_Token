using AngularAuthAPI.context;
using AngularAuthAPI.Helpers;
using AngularAuthAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AngularAuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        public UserController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Username == userObj.Username); 
            if (user == null)
                return NotFound(new {Message ="User not found!" });
            if(!PasswordHasher.VerifyPassword(userObj.Password,user.Password))
            {
                return BadRequest(new { Message = "Password is Incorrect" });
            }

            return Ok(new { Message = "Login Success" });
        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();
            //check exist username
            if (await CheckUserNameExistAsync(userObj.Username))
                return BadRequest(new { Message = "Username already exists" });
            //check email exists
            if (await CheckEmailExistAsync(userObj.Email))
                return BadRequest(new { Message = "Email already exists" });
            //password strength
            var pass = CheckPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(pass))
                return BadRequest(new { Message = pass.ToString() });
           // var pass = CheckPasswordStrength(userObj.Password);
            userObj.Password = PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = "";
            await _dbContext.Users.AddAsync(userObj);
            await _dbContext.SaveChangesAsync();
            return Ok(new { Message = "User Registered!" });
        }
        private async Task<bool> CheckUserNameExistAsync(string username)
        {
            return await _dbContext.Users.AnyAsync(x => x.Username == username);
        }
        private async Task<bool> CheckEmailExistAsync(string email)
        {
            return await _dbContext.Users.AnyAsync(x => x.Email == email);
        }
        //  private Task<bool> CheckEmailExistAsync(string email) => _dbContext.Users.AnyAsync(x => x.Email == email);
        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();
            if(password.Length<8)
                sb.Append("Minimum password length should be 8" + Environment.NewLine);
            if(!(Regex.IsMatch(password,"[a-z]") && Regex.IsMatch(password,"[A-Z]") && Regex.IsMatch(password,"[0-9]")))
                    sb.Append("Password should be alphanumeric"+Environment.NewLine);
            return sb.ToString();
        }
    }
}
