using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace TimeManagementSystem.API {
	public class RoleRepository : IDisposable {
		private AuthContext _ctx;

		private RoleManager<IdentityRole> _roleManager;

		public void Dispose() {
			_ctx.Dispose();
			_roleManager.Dispose();
		}

		public RoleRepository() {
			_ctx = new AuthContext();
			_roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(_ctx));
		}

		public async Task<string> GetRoleNameById(string id) {
			var role = await _roleManager.FindByIdAsync(id);
			return role.Name;
		}
	}
}