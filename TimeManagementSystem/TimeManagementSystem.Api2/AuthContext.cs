using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TimeManagementSystem.API.Models;

namespace TimeManagementSystem.API {
	public class AuthContext : IdentityDbContext<IdentityUser> {
		public AuthContext() :base("AuthContext") {

		}
		public DbSet<TimeRecord> TimeRecors { get; set; }
	}
}