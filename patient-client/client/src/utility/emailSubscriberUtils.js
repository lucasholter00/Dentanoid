import { Api } from '@/Api'

export async function postSubscriber(subscriber) {
  try {
    const res = await Api.post('subscriber/', subscriber)
    if (res.data.status === 201) {
      return res.data
    }
    return false
  } catch (err) {
    console.error('Error when posting subscriber', err)
  }
}

export async function getSubscription() {
  try {
    const res = await Api.get('subscriber/')
    if (res.data.status === 200 || res.data.status === 304) {
      return res.data.subscriber
    }
    return false
  } catch (err) {
    console.error('Error when getting subscriber', err)
  }
}

export async function updateSubscription(subscriber) {
  try {
    const res = await Api.patch('subscriber/', subscriber)
    if (res.data.status === 200 || res.data.status === 304) {
      return res
    }
    return false
  } catch (err) {
    console.error('Error when getting subscriber', err)
  }
}

export async function deleteSubscription() {
  try {
    const res = await Api.delete('subscriber/')
    if (res.data.status === 200 || res.data.status === 304) {
      return res
    }
    return false
  } catch (err) {
    console.error('Error when getting subscriber', err)
  }
}
