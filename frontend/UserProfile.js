import React from 'react';
import StarRating from "./src/reusables/StarRating";
import {formatDatetime} from "./src/reusables/vanilla/date";

const EmptyElement = ({name}) => <div className="empty">No {name}</div>;

const UserProfile = ({userData, userTrust, userSocials, userReviews}) => (
    <div className="profile-container">
        <div className="profile-header">
            <div className="profile-picture">
                <img className="avatar" src={userData.picture} alt=""/>
                <div className="name">
                    {userData.nickname}
                    {userData.verifications.name ? <span className="icon-verified_user"/> : ""}
                </div>
            </div>
        </div>
        <div className="verifications">
            <h4>Verified IDs</h4>
            <div className="id-verifications">
                {userTrust.verifications.length > 0 ? "" : <EmptyElement name="verifications"/>}
                {userTrust.verifications.map(v => <p>{v.document} on {formatDatetime(v.created_at)}</p>)}
            </div>
        </div>
        <div className="about">
            <h3>About</h3>
            {userData.about ? userData.about : <EmptyElement name="about text"/>}
        </div>

        <div className="contacts-container">
            <div className="contacts">
                <h3>Contacts</h3>
                {userData.email ? <div className="contact email">
                    {userData.email}
                    {userData.email_verified ? <span className="icon-verified_user"></span> : ""}
                </div> : <EmptyElement name="email"/>}
                {userData.phone_number ? <div className="contact phone_number">
                    {userData.phone_number}
                    {userData.phone_number_verified ? <span className="icon-verified_user"></span> : ""}
                </div> : <EmptyElement name="phone"/>}
            </div>
            <div className="address">
                <h3>Address</h3>
                {userData.address ? <div className="contact address">{userData.address}</div> :
                    <EmptyElement name="address"/>}
            </div>
            <div className="social-accounts">
                <h3>Socials</h3>
                {userSocials.length === 0 ? <EmptyElement name="socials"/> : ""}
                {userSocials.map(s => <div className="social-account"><a href={s.aggregates[0].url}>{s.platform}</a></div>)}
            </div>
        </div>
        {/*<div className="profile-content">*/}
        <div className="reviews">
            <h3>Reviews</h3>
            {userReviews.length === 0 ? <EmptyElement name="reviews"/> : ""}
            {userReviews.map(r => <div className="review">
                <div className="rating">
                    <StarRating rating={r.rating} maxRating={5}/>
                </div>
                <div
                    className="about">{r.contract.name} on {formatDatetime(r.contract.date)} as {r.parties.subject}</div>
                <div className="text">{r.text}</div>
                <div className="created_at">created at {formatDatetime(r.created_at)}</div>
                <div className="author">by {r.author.name} as {r.parties.author}</div>
            </div>)}
        </div>
        {/*</div>*/}
    </div>
);

export default UserProfile;