import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { login, logout, register } from '../api/auth'
import Cookies from 'js-cookie'

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => login(dat),
    onSuccess: () => {
      queryClient.invalidateQueries(['login'])
    },
  })
}

export const useRegisterMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => register(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['register'])
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.invalidateQueries(['logout'])
    },
  })
}

export function useAuthQuery() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: () => {
      const token = Cookies.get('token')
      if (!token) throw new Error('Not authenticated')
      return { token }
    },
    retry: false,
    staleTime: Infinity,
  })
}

