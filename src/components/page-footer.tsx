export default function PageFooter() {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="w-full max-w-screen-xl mx-auto p-2">
        <hr className="border-gray-200 sm:mx-auto dark:border-gray-700" />
        <span className="block text-sm text-gray-500 text-center dark:text-gray-400 mt-1">
          Made with ❤️ by
          <a href="https://www.linkedin.com/in/camilo-martinez-m/" className="hover:text-highlight">
            {' '}
            Camilo Martínez
          </a>
          , Honglu Ma &amp;
          <a href="https://www.linkedin.com/in/dhimitriosduka/" className="hover:text-highlight">
            {' '}
            Dhimitrios Duka
          </a>
          .
        </span>
        <span className="block text-sm text-gray-500 text-center dark:text-gray-400 mt-1">
          Copyright © 2024. P&middot;D&middot;E&middot;FUSE&middot;IT. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
