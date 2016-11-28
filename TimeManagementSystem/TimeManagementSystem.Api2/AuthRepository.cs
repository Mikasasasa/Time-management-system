using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TimeManagementSystem.API.Models;

namespace TimeManagementSystem.API {
	public class AuthRepository : IDisposable {
		private AuthContext _ctx;

		private UserManager<ExtendedIdentityUser> _userManager;

		public AuthRepository() {
			_ctx = new AuthContext();
			_userManager = new UserManager<ExtendedIdentityUser>(new UserStore<ExtendedIdentityUser>(_ctx));
		}

		public async Task<IdentityUser> RegisterUser(User user) {
			var authUser = new ExtendedIdentityUser {
				UserName = user.Login,
				PreferredWorkingHourPerDay = user.PreferredWorkingHourPerDay
			};

			var result = await _userManager.CreateAsync(authUser, user.Password);
			var result2 = await _userManager.AddToRoleAsync(authUser.Id, Enum.GetName(user.PermissionLevel.GetType(), user.PermissionLevel));

			return authUser;
		}

		public async Task<IdentityUser> FindUser(string userName, string password) {
			IdentityUser user = await _userManager.FindAsync(userName, password);

			return user;
		}

		public async Task<ExtendedIdentityUser> FindUser(string name) {
			var user = await _userManager.FindByNameAsync(name);

			return user;
		}

		public IList<ExtendedIdentityUser> GetAll() {
			return _userManager.Users.ToList();
		}

		public async void UpdateUser(User user) {
			var authUser = await _userManager.FindByIdAsync(user.Id);
			authUser.UserName = user.Login;
			authUser.PreferredWorkingHourPerDay = user.PreferredWorkingHourPerDay;
			var result = await _userManager.UpdateAsync(authUser);
			if (user.PermissionLevel != getPermissionLevel(authUser.Roles.FirstOrDefault().RoleId) && user.PermissionLevel != PermissionLevel.Undefined) {
				var result2 = await _userManager.RemoveFromRoleAsync(authUser.Id, authUser.Roles.FirstOrDefault().RoleId);
				var result3 = await _userManager.AddToRoleAsync(authUser.Id, Enum.GetName(user.PermissionLevel.GetType(), user.PermissionLevel));
			}
		}

		public async void DeleteUser(string id) {
			var authUser = await _userManager.FindByIdAsync(id);
			var result = await _userManager.DeleteAsync(authUser);
		}

		public void Dispose() {
			_ctx.Dispose();
			_userManager.Dispose();

		}

		public PermissionLevel getPermissionLevel(string roleId) {
			switch (roleId) {
				case "0":
					return PermissionLevel.Regular;
				case "1":
					return PermissionLevel.UserManager;
				case "2":
					return PermissionLevel.Administrator;
				default:
					return PermissionLevel.Undefined;
			}
		}
	}
}