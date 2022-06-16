import { all, takeEvery, put, fork, call, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';
import {SignUpDataSuccess,SignUpDataFailed,UserStateSuccess,UserStateFaild,ListOfSubscriptionPlanSuccess,ListOfSubscriptionPlanFailed,StateDetails,StateDetailsSuccess,StateDetailsFaild, changeProfilePasswordFailed, uploadImageFailed, changeProfilePasswordSuccess, deleteUsersFailed, deleteUsersSuccess, profileGetUsersFailed, profileGetUsersSuccess, profileUserAddFailed, profileUserAddSuccess, updateAddProfileFailed, updateAddProfileSuccess, uploadImageSuccess } from "redux/actions/profile";
import {SIGNUP_DATA,USERS_STATES,SUBSCRIPTION_PLAN,STATE_DEATILS, AUTH_TOKEN, CHANGE_PROFILE_PASSWORD, DELETE_REQUEST, PROFILE_ADD_USER, PROFILE_GET_USER, UPDATE_ADDUSER_PROFILE, UPLOAD_IMAGE } from "redux/constants/Auth";
import JwtAuthService from "services/JwtAuthService";
import Swal from 'sweetalert2';


export function* profileAddUser() {
	yield takeEvery(PROFILE_ADD_USER, function* ({ payload }) {
		try {
			const user = yield call(JwtAuthService.profileAddUser, payload.request);
			if (user.success) {
				yield put(profileUserAddSuccess(user));
				Swal.fire(
						'User is Successfully Add',
						'',
						'success'
					);	
					window.location.reload();			
			} else {
				yield put(profileUserAddFailed(user.message));
				Swal.fire(
					user.message,
					'',
					'warning'
				);
			}
		} catch (error) {
			yield put(profileUserAddFailed(error));

		}
	});
}

export function* fetchAddUsers(action) {
	try {
		const users = yield call(JwtAuthService.getProfileAddUsers);
		console.log(users,'userdata')
		if(users){
		
			yield put(profileGetUsersSuccess(users));
		}else{
			yield put(profileGetUsersFailed(users.message));
		}
	} catch (error) {
		yield put(profileGetUsersFailed(error.message));
	}
 }

export function* watchRequest() {
	yield takeLatest(PROFILE_GET_USER, fetchAddUsers);
 }


 export function* fetchSubscriptionPlan(action) {
	try {
		const users = yield call(JwtAuthService.getSubscriptionPlan);
		console.log(users,'userdata')
		if(users){
		
			yield put(ListOfSubscriptionPlanSuccess(users));
		}else{
			yield put(ListOfSubscriptionPlanFailed(users.message));
		}
	} catch (error) {
		yield put(ListOfSubscriptionPlanFailed(error.message));
	}
 }

export function* planRequest() {
	yield takeLatest(SUBSCRIPTION_PLAN, fetchSubscriptionPlan);
 }


 export function* fetchStateDetails(action) {
	try {
		// const users = yield call(JwtAuthService.stateUpdate,action);
		if(action){
		
			yield put(StateDetailsSuccess(action));
		}else{
			yield put(StateDetailsFaild(action.message));
		}
	} catch (error) {
		yield put(StateDetailsFaild(error.message));
	}
 }

export function* StateRequest() {
	yield takeLatest(STATE_DEATILS, fetchStateDetails);
 }

 export function* signUpformData(action) {
	console.log(action,'SIGNUP_DATA')
	try {
		// const users = yield call(action);
		console.log(action,'SIGNUP_DATA')
		// console.log(users,'SIGNUP_DATA')
		if(action){
			console.log(action,'SIGNUP_DATA')
			yield put(SignUpDataSuccess(action));
		}else{
			yield put(SignUpDataFailed(action.message));
		}
	} catch (error) {
		yield put(SignUpDataFailed(error.message));
	}
 }

 export function* SignupdataRequest() {
	yield takeLatest(SIGNUP_DATA, signUpformData);
 }



 export function* fetchUserState(action) {
	try {
		// const users = yield call(JwtAuthService.stateUpdate,action);
		if(action){
		
			yield put(UserStateSuccess(action));
		}else{
			yield put(UserStateFaild(action.message));
		}
	} catch (error) {
		yield put(UserStateFaild(error.message));
	}
 }

export function* UserStateRequest() {
	yield takeLatest(USERS_STATES, fetchUserState);
 }
 export function* updateAddProfile() {
	yield takeEvery(UPDATE_ADDUSER_PROFILE, function* (payload) {
console.log('payload', payload)
		try {
			const user = yield call(JwtAuthService.updateAddProfile, payload.request);
			console.log('userup', user)
			if (user) {
				yield put(updateAddProfileSuccess(user));
				notification['success']({
					message: 'User Profile Updated',
					description: '',
				});
			} else {
				yield put(updateAddProfileFailed(user.message));
				notification['error']({
					message:'User Profile not Updated',
					description: '',
				});
			}
		} catch (error) {
			yield put(updateAddProfileFailed(error));
		}
	});
}

export function* deleteUsers() {
	yield takeEvery(DELETE_REQUEST, function* ({ payload }) {
		try {
			const user = yield call(JwtAuthService.deleteUsers, payload.request)
			if (user.success === true) {
				yield put(deleteUsersSuccess(user));
				notification['success']({
					message: 'User Deleted',
					description: '',
				});
				window.location.reload();
			} else {
				yield put(deleteUsersFailed(user.message));
				notification['error']({
					message: user.message,
					description: '',
				});
			}
		} catch (error) {
			yield put(deleteUsersFailed(error));
		}
	});
}

export function* changeProfilePassword() {
	yield takeEvery(CHANGE_PROFILE_PASSWORD, function* ({ payload }) {

		try {
			const user = yield call(JwtAuthService.changeProfilePassword, payload.request);
			if (user.success === true) {
				yield put(changeProfilePasswordSuccess(user));
				notification['success']({
					message: 'Password Successfully Changed',
					description: '',
				});
			} else {
				yield put(changeProfilePasswordFailed(user.message));
				notification['error']({
					message: user.message,
					description: '',
				});
			}
		} catch (error) {
			yield put(changeProfilePasswordFailed(error));
		}
	});
}

export function* uploadImages() {
	yield takeEvery(UPLOAD_IMAGE, function* ({ payload }) {
console.log('saga', payload);
		try {
			const user = yield call(JwtAuthService.uploadImage, payload.profile);
			console.log('user', user);
			if (user.success === true) {
				localStorage.setItem(AUTH_TOKEN, user.token);
				yield put(uploadImageSuccess(user));
				notification['success']({
					message: 'Image Uploaded Successfull',
					description: '',
				});
			} else {
				yield put(uploadImageFailed(user.message));
				notification['error']({
					message: user.message,
					description: '',
				});
			}
		} catch (error) {
			yield put(uploadImageFailed(error));
		}
	});
}

export default function* rootSaga() {
	yield all([
		fork(profileAddUser),
		fork(watchRequest),
		fork(updateAddProfile),
		fork(deleteUsers),
		fork(changeProfilePassword),
		fork(uploadImages),
		fork(StateRequest),
		fork(planRequest),
		fork(UserStateRequest),
		fork(SignupdataRequest),
	]);
}