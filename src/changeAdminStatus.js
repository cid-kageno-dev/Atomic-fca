"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return async function changeAdminStatus(threadID, adminIDs, adminStatus, callback) {
		try {
			// =======================
			// 🔒 VALIDATION
			// =======================

			if (typeof threadID !== "string" || !threadID.trim()) {
				throw new utils.CustomError({
					error: "changeAdminStatus: threadID must be a non-empty string"
				});
			}

			// Normalize adminIDs
			if (typeof adminIDs === "string") {
				adminIDs = [adminIDs];
			}

			if (!Array.isArray(adminIDs)) {
				throw new utils.CustomError({
					error: "changeAdminStatus: adminIDs must be an array or string"
				});
			}

			// Clean + validate IDs
			adminIDs = adminIDs
				.filter(id => typeof id === "string" && id.trim())
				.map(id => id.trim());

			if (adminIDs.length === 0) {
				throw new utils.CustomError({
					error: "changeAdminStatus: adminIDs is empty or invalid"
				});
			}

			if (typeof adminStatus !== "boolean") {
				throw new utils.CustomError({
					error: "changeAdminStatus: adminStatus must be a boolean"
				});
			}

			if (callback && typeof callback !== "function") {
				throw new utils.CustomError({
					error: "changeAdminStatus: callback must be a function"
				});
			}

			// =======================
			// 📦 BUILD REQUEST
			// =======================

			const form = {
				thread_fbid: threadID,
				add: adminStatus
			};

			adminIDs.forEach((id, i) => {
				form[`admin_ids[${i}]`] = id;
			});

			// =======================
			// 🌐 REQUEST
			// =======================

			const resData = await defaultFuncs
				.post("https://www.facebook.com/messaging/save_admins/?dpr=1", ctx.jar, form)
				.then(utils.parseAndCheckLogin(ctx, defaultFuncs));

			// =======================
			// ⚠️ ERROR HANDLING
			// =======================

			if (resData?.error) {
				switch (resData.error) {
					case 1976004:
						throw new utils.CustomError({
							error: "Cannot alter admin status: you are not an admin.",
							rawResponse: resData
						});

					case 1357031:
						throw new utils.CustomError({
							error: "Cannot alter admin status: this is not a group chat.",
							rawResponse: resData
						});

					default:
						throw new utils.CustomError({
							error: `Cannot alter admin status: ${resData.error}`,
							rawResponse: resData
						});
				}
			}

			// =======================
			// ✅ SUCCESS
			// =======================

			if (callback) callback(null);
			return true;

		} catch (err) {
			// =======================
			// 🪵 LOGGING
			// =======================

			log.error("changeAdminStatus", {
				threadID,
				adminIDs,
				adminStatus,
				error: err
			});

			if (callback) return callback(err);
			throw err;
		}
	};
};
