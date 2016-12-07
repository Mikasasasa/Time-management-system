using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TimeManagementSystem.API.Models;

namespace TimeManagementSystem.API {
	public class DbInitializer : CreateDatabaseIfNotExists<AuthContext> {
		protected override void Seed(AuthContext context) {
			var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
			roleManager.Create(new IdentityRole { Id = "0", Name = "Regular" });
			roleManager.Create(new IdentityRole { Id = "1", Name = "UserManager" });
			roleManager.Create(new IdentityRole { Id = "2", Name = "Administrator" });

			var manager = new UserManager<ExtendedIdentityUser>(new UserStore<ExtendedIdentityUser>(context));

			var user = new ExtendedIdentityUser { UserName = "admin" };
			manager.Create(user, "admin11");
			manager.AddToRole(user.Id, "Administrator");

			base.Seed(context);
		}
	}
}