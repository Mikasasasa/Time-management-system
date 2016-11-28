using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Description;

namespace TimeManagementSystem.API.Controllers
{
    public class RolesController : ApiController {

		// GET: api/Roles
		[ResponseType(typeof(string))]
		[Authorize]
		public IHttpActionResult GetRole() {
			var identity = (ClaimsIdentity)User.Identity;
			IEnumerable<Claim> claims = identity.Claims;

			return Ok(claims.FirstOrDefault(claim => claim.Type == "role").Value);
		}
	}
}
