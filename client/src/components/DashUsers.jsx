import { Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { current } from "@reduxjs/toolkit";
export default function Dashusers() {
  const [UsersList, setUsersList] = useState([]);
  const [showMore, setShowMore] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [userIdTodelete, setuserIdTodelete] = useState();

  const [showModal, setShowModal] = useState(false);
  console.log(UsersList);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/user/getusers");
        const data = await res.json();
        if (res.ok) {
          setUsersList(data);
          if (data.length < 9) {
            setShowMore(false);
          } else {
            setShowMore(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);
  const handleShowMore = async (req, res, next) => {
    const startIndex = UsersList.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsersList([...UsersList, ...data]);
        if (data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/user/delete/${userIdTodelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setUsersList((prev) =>
          prev.filter((users) => users._id !== userIdTodelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && UsersList.length > 0 ? (
        <>
          <Table hoverable className="shadow-lg">
            <Table.Head>
              <Table.HeadCell>Created At</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>
                <span>Delete</span>
              </Table.HeadCell>
            </Table.Head>
            {UsersList.map((UsersList) => (
              <Table.Body className="divide-y" key={UsersList._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(UsersList.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={UsersList.profilePicture}
                      alt={UsersList.username}
                      className="object rounded-full cover w-10 h-10 bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {UsersList.username}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{UsersList.email}</Table.Cell>
                  <Table.Cell>
                    {UsersList.isAdmin ? (
                      <FaCheck className="text-teal-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {UsersList.isAdmin ? (
                      ""
                    ) : (
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setuserIdTodelete(UsersList._id);
                        }}
                        className=" cursor-pointer text-red-500 font-medium hover:underline"
                      >
                        Delete
                      </span>
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p> No posts yet </p>
      )}
      {showMore && (
        <button
          onClick={handleShowMore}
          className="text-teal-500 w-full self-center py-7 text-sm "
        >
          Show More
        </button>
      )}
      {showModal && (
        <Modal
          show={showModal}
          popup
          onClose={() => setShowModal(false)}
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-3 text-lg  text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </h3>
              <div className="flex justify-between">
                <Button color="failure" onClick={handleDeletePost}>
                  Yes, I'm sure
                </Button>
                <Button color="success" onClick={() => setShowModal(false)}>
                  No, Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
