export default interface ILaunchable {
  id: string
  executable: boolean
  type: string
  path: string
  name: string
  command: string
  desktop: boolean
}
