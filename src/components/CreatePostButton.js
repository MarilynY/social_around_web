import React from 'react';
import { Button, Modal, message } from 'antd';
import { CreatePostForm } from './CreatePostForm'; 
import { API_ROOT, POS_KEY, TOKEN_KEY, AUTH_HEADER, LOC_SHAKE } from '../constants';


export class CreatePostButton extends React.Component {
    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
    };
    
    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleOk = () => {
        this.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                const formData = new FormData();
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
                const token = localStorage.getItem(TOKEN_KEY);
                formData.set("message",values.message);
                formData.set("image", values.image[0].originFileObj);
                formData.set("lat", lat + 2 * Math.random() * LOC_SHAKE - LOC_SHAKE);
                formData.set("lon", lon + 2 * Math.random() * LOC_SHAKE - LOC_SHAKE);

                /*Add some noise to location
                lat - X     lat     lat + X  (X cannot be too big)
                Math.random()   -->    0 ~ 1
                -0.5            --> -0.5 ~ 0.5
                *2              -->   -1 ~ 1
                *X              -->   -X ~ X
                +lat            -->  lat - X ~ lat + X

                (Math.random() - 0.5) * 2 * X + lat
                = lat + 2 * Math.random() * X - X
                  lon + 2 * Math.random() * X - X
                */

                //Create button becomes unable to be clicked
                this.setState({
                    confirmLoading: true,
                });

                //fire API call
                fetch(`${API_ROOT}/post`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `${AUTH_HEADER} ${token}`
                    }
                }).then((response) => {
                    if (response.ok) {
                        // clear form after success fetch
                        this.form.resetFields();

                        //Create button becomes able to be clicked again
                        this.setState({
                            visible: false,
                            confirmLoading: false
                        });
                        //rerender Home.js, so you will see new post without refresh
                        return this.props.loadNearbyPosts();
                    }
                    throw new Error(response.statusText);
                }).then(() => {
                    message.success('Post created successfully!');
                }).catch((err) => {
                    console.log(err);
                    message.error('Failed to create the post.');
                    //Create button becomes able to be clicked again
                    this.setState({
                        confirmLoading: false
                    });
                })
            }
        });
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    getFormRef = (formInstance) => {
        this.form = formInstance;
    }

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText="Create"
                >
                    <CreatePostForm ref={this.getFormRef}/>
                </Modal>
            </div>
        );
    }
}
