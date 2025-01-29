import { Api } from '../Api'

export async function getDentist(dentistId) {
  try {
    const res = await Api.get('dentists/' + dentistId)
    if (res.status === 200) {
      return res
    }
  } catch (err) {
    console.error('Error when getting dentist', err)
  }
}
