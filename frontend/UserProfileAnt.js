import React from 'react';
import { Card, Avatar, Badge, List, Rate } from 'antd';
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons';


const UserProfileAnt = ({ userData, userTrust, userSocials, userReviews }) => (
  <div className="profile-container">
    <Card className="profile-header">
      <List.Item.Meta
        avatar={
          <Avatar size="large" image={userData.image} />
        }
        title={userData.nickname}
        description={
          userData.verifications.name && (
            <Badge
              count={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              title="Verified"
            />
          )
        }
      />
      {userTrust && (
        <div className="trust">
          <List
            itemLayout="horizontal"
            dataSource={userTrust.socials}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={`score ${item.score}`}
                />
              </List.Item>
            )}
          />
          <List
            itemLayout="horizontal"
            dataSource={userTrust.verifications}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.document}
                  description={`on ${item.created_at}`}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
    <div className="profile-content">
      <Card title="Social Accounts">
        {userSocials.map((s, index) => (
          <Card.Grid key={index} className="social-account">
            {s.platform}
          </Card.Grid>
        ))}
      </Card>
      <Card title="Reviews">
        {userReviews.map((r, index) => (
          <Card key={index} className="review">
            <p>{r.contract.name} on {r.contract.date} as {r.parties.subject}</p>
            <Rate disabled defaultValue={r.rating} />
            <p>{r.text}</p>
            <p>by {r.author.name} as {r.parties.author}</p>
            <p>created at {r.created_at}</p>
          </Card>
        ))}
      </Card>
    </div>
  </div>
);

export default UserProfileAnt;
