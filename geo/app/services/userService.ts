export async function updateUser(token: string, name: string, photo: string) {
  return await fetch("http://192.168.18.12:4000/users/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, photo }),
  }).then(res => res.json());
}
