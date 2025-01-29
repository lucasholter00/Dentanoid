import { Api } from '@/Api'

export async function getPatient() {
  try {
    const res = await Api.get('patients/')
    if (res.status === 200) {
      return res.data.patient
    }
  } catch (err) {
    console.error('Error when getting patient', err)
  }
}
