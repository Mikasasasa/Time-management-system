using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace TimeManagementSystem.API {
	public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider {
		public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context) {
			context.Validated();
		}

		public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context) {

			context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
			string role;
			string userId;

			using (UserRepository _repo = new UserRepository()) {
				IdentityUser user = await _repo.FindUser(context.UserName, context.Password);

				if (user == null) {
					context.SetError("invalid_grant", "The user name or password is incorrect.");
					return;
				}
				var roleId = user.Roles.FirstOrDefault().RoleId;
				using (var _roleRepo = new RoleRepository()) {
					role = await _roleRepo.GetRoleNameById(roleId);
				}
				userId = user.Id;
			}

			var identity = new ClaimsIdentity(context.Options.AuthenticationType);
			identity.AddClaim(new Claim("userId", userId));
			identity.AddClaim(new Claim("username", context.UserName));
			identity.AddClaim(new Claim(ClaimTypes.Role, role));

			context.Validated(identity);

		}
	}
}