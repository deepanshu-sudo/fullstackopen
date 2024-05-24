import axios from "axios";

const baseUrl = '/api/persons';

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data);
};

const create = (personObject) => {
  return axios.post(baseUrl, personObject).then(response => response.data);
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data);
};

const updatePerson = (id, newPerson) => {
  return axios.put(`${baseUrl}/${id}`, newPerson).then(response => response.data);
};

export default { getAll, create, deletePerson, updatePerson };