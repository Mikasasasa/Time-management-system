using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Description;
using TimeManagementSystem.API.Models;

namespace TimeManagementSystem.API.Controllers
{
    public class RolesController : ApiController {

		// GET: api/Roles
		[ResponseType(typeof(PermissionLevel))]
		[Authorize]
		public IHttpActionResult GetRole() {
			var identity = (ClaimsIdentity)User.Identity;
			IEnumerable<Claim> claims = identity.Claims;

			return Ok(Enum.Parse(typeof(PermissionLevel), claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role).Value));
		}
	}
}
