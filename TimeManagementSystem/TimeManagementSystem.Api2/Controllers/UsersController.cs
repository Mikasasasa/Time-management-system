using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using TimeManagementSystem.API;
using TimeManagementSystem.API.Models;

namespace TimeManagementSystem.API.Controllers
{
    public class UsersController : ApiController
    {
        private TimeManagementSystemContext db = new TimeManagementSystemContext();

		private UserRepository _repo;

		public UsersController() {
			_repo = new UserRepository();
		}

		// GET: api/Users
		[Authorize]
		public async Task<IList<User>> GetUsers()
        {
			var identity = (ClaimsIdentity)User.Identity;
			IEnumerable<Claim> claims = identity.Claims;

			var role = claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role).Value;
			var username = claims.FirstOrDefault(claim => claim.Type == "username").Value;

			if(_repo.GetPermissionLevel(role) == PermissionLevel.Regular) {
				var user = await _repo.FindUser(username);
				return new List<User> { new User {
					Id = user.Id,
					Login = user.UserName,
					PreferredWorkingHourPerDay = user.PreferredWorkingHourPerDay
				}};
			} else {
				var users = _repo.GetAll();
				return users.Select(user => new User {
					Id = user.Id,
					Login = user.UserName,
					PermissionLevel = _repo.GetPermissionLevel(user.Roles.FirstOrDefault().RoleId),
					PreferredWorkingHourPerDay = user.PreferredWorkingHourPerDay
				}).ToList();
			}
        }

        // GET: api/Users/5
        [ResponseType(typeof(User))]
		[Authorize]
		public async Task<IHttpActionResult> GetUser(string username) {
			var identity = (ClaimsIdentity)User.Identity;
			IEnumerable<Claim> claims = identity.Claims;

			var role = claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role).Value;
			if(_repo.GetPermissionLevel(role) == PermissionLevel.Regular) {
				return Unauthorized();
			}

			var user = await _repo.FindUser(username);
			if (user == null) {
				return NotFound();
			}
			var result = new User {
				Id = user.Id,
				Login = user.UserName,
				PermissionLevel = _repo.GetPermissionLevel(user.Roles.FirstOrDefault().RoleId),
				PreferredWorkingHourPerDay = user.PreferredWorkingHourPerDay
			};
			return Ok(result);
		}

		// PUT: api/Users/5
		[ResponseType(typeof(void))]
		[Authorize]
		public async Task<IHttpActionResult> PutUser(string id, User user) {
			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			if (id != user.Id) {
				return BadRequest();
			}

			var identity = (ClaimsIdentity)User.Identity;
			IEnumerable<Claim> claims = identity.Claims;

			var role = claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role).Value;
			var userId = claims.FirstOrDefault(claim => claim.Type == "userId").Value;

			if (_repo.GetPermissionLevel(role) != PermissionLevel.Regular) {
				await _repo.UpdateUser(user);
			} else {
				if (id == userId) {
					user.PermissionLevel = PermissionLevel.Undefined;
					await _repo.UpdateUser(user);
				} else {
					return Unauthorized();
				}
			}
			return Ok();
		}

        // POST: api/Users
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

			var result = await _repo.RegisterUser(user);

			var errorResult = GetErrorResult(result);

			if (errorResult != null) {
				return errorResult;
			}
            
            return Created(user.Login, user);
		}

		private IHttpActionResult GetErrorResult(IdentityResult result) {
			if (result == null) {
				return InternalServerError();
			}

			if (!result.Succeeded) {
				if (result.Errors != null) {
					foreach (string error in result.Errors) {
						ModelState.AddModelError("", error);
					}
				}

				return BadRequest(ModelState);
			}

			return null;
		}

		// DELETE: api/Users/5
		[ResponseType(typeof(User))]
		[Authorize]
		public async Task<IHttpActionResult> DeleteUser(string id)
        {
			var identity = (ClaimsIdentity)User.Identity;
			IEnumerable<Claim> claims = identity.Claims;

			var role = claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role).Value;

			if (_repo.GetPermissionLevel(role) != PermissionLevel.Regular) {
				await _repo.DeleteUser(id);
			}
			else {
				return Unauthorized();
			}

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
	}
}