// const updateUserDetails = async (uuid, newFirstName, newLastName) => {
//     const { data, error } = await supabase
//       .from('user_details')
//       .update({ first_name: newFirstName, last_name: newLastName })
//       .eq('uuid', uuid);
  
//     if (error) console.error(error);
//     else console.log('User updated:', data);
//   };
//   const deleteUser = async (uuid) => {
//     const { error } = await supabase
//       .from('user_details')
//       .delete()
//       .eq('uuid', uuid);
  
//     if (error) console.error(error);
//     else console.log('User deleted');
//   };
  