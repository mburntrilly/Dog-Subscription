export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/app/month',
      permanent: false,
    }
  };
}

export default function AppIndex() {
  return null;
}
