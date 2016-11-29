﻿using Microsoft.AspNet.Identity.EntityFramework;
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
				role = user.Roles.FirstOrDefault().RoleId;
				userId = user.Id;
			}

			var identity = new ClaimsIdentity(context.Options.AuthenticationType);
			identity.AddClaim(new Claim("userId", userId));
			identity.AddClaim(new Claim("username", context.UserName));
			identity.AddClaim(new Claim("role", role));

			context.Validated(identity);

		}
	}
}