export default function PageFooter() {
  return (
    <footer className="bg-white dark:bg-body">
      <div className="w-full max-w-screen-xl mx-auto p-2">
        <hr className="border-gray-200 sm:mx-auto dark:border-gray-700" />
        <span className="block text-sm text-gray-500 text-center dark:text-gray-400 mt-2">
          Made with ❤️ by
          <a
            href="https://www.linkedin.com/in/camilo-martinez-m/"
            className="text-highlight"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            Camilo Martínez
          </a>
          ,{' '}
          <a
            href="https://github.com/Kanakanajm"
            className="text-highlight"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            Honglu Ma
          </a>{' '}
          &amp;
          <a
            href="https://www.linkedin.com/in/dhimitriosduka/"
            className="text-highlight"
            target="_blank"
            rel="noopener noreferrer"
          >
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
