using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TimeManagementSystem.API.Models {
	public class ExtendedIdentityUser : IdentityUser {
		public int? PreferredWorkingHourPerDay { get; set; }
	}
}