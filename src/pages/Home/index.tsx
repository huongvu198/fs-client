import BannerComponent from "@components/Banner";
import Footer from "@components/FooterComponent";
import ProductSection from "@components/ProductCardComponent";
import StyleBannerComponent from "@components/StyleBannerComponent";
import TestimonialsCarousel from "@components/TestimonialCarousel";
import { useEffect, useState } from "react";

const bannerProps = {
  title: "FIND CLOTHES THAT MATCHES YOUR STYLE",
  subTitle:
    "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
  buttonText: "Shop Now",
  stats: [
    { value: 0, label: "International Brands" },
    { value: 0, label: "High-Quality Products" },
    { value: 0, label: "Happy Customers" },
  ],
  imgSrc:
    "https://s3-alpha-sig.figma.com/img/b26f/ea69/ccfd8aa5825862cdb9604a4fb4930464?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Lim80RmWzpvPYiZcu~9~3V~wSgGzBFH-Ssd2Qf-U691cxKG6VyUDsf6aDXKL4-rITE~lPAWhsBzqc~JGW6VDCEltolfSu0~Rw62SquZ8Yy75rM13Uj9t8Hn4DfXemzzz3wVCxDsu8vVqEWMKc-sU3B6AFRrBZtX1YwT3cuILmy8uivP6D~5AA0bTlFcDlS7i4Pz~IE0R597IBx0OfMWEgVEJ1YVQvthRa2KXvK~pMOSH2M0Jv1LXYwhnz8rvcuLmEfHmMFSrAL-19MDmUTOQrY6xY~ZvC1SCB8F2Noj0ep5Hmvna1Jk-Y494y5XYOWzA4fLpOcWGX7HZ1rXyTj62Lw__",
};

const newArrivals = [
  { id: '1', name: 'T-shirt with Tape Details', image: 'https://s3-alpha-sig.figma.com/img/d40d/a9a3/a7234235e66d6695d9d7098fc3289872?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=qZZX3x1fJDAKFkr8urNbWJfRHBb0sycIcGsuukEen-33jNs7GIBCMhItTT2shJFncUenuqvORqpmU18IiCKqGMn~0D2HKeI5fWyPVcyPZlmgGkEpkVu5nMZ4tx2MIBwPPpiRHasUvQg0BuOvdjFSpojq~XXxMAA7seKk-AJkFCZ79wXbtMCpnawXBhLtsFCGKnDLIVzklyFYB6sZdN4W5pNUztTpEFfcgx2bXjsDeceGfzJyzZzAC8CAby-cSxW~fryvaIhEsJdlpf~nSdm-LqGCSz8YQGZDAa3i1Hqbw~aAXs5Z~cRkA2W93noWB3DcYfKGhTV6xfyg5FkrRu6xuQ__', rating: 4.5, reviews: 456, price: 120 },
  { id: '2', name: 'Skinny Fit Jeans', image: 'https://s3-alpha-sig.figma.com/img/769b/9d60/ff941dde9bc0e54431b8d8fe3182f5e9?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oteEkJ5zz80QQdDcIjM8q0dYNMdXKzFpQnda5HpXj-z-We2i84haDV38JTH8HjjLU8lDYyjPauM6HUOCM~EjbNiZAdcqE6x9CzJ~Sx489ORVEWSJ8IoMzm5xbtdM2U3MLvk0iFnifLWjKfs5rfpeXHS160B9e5WTM-Ry5D8sfU3rnDgwXzmt79GdRwKRCW8AltukPX~HWzioC-zhcuN5lD74ZLfAKbMgw5hAy5ULF0NTWMlIpkesdwAQ2EEorOlyrdIUqR9Bj0kKRFlifNS-WGpERzgfLaDTzj03dUSkp3d9kURDEh8ZmDPCCyBsnP3fusQi5eqiIw7DAtN~1JeX5A__', rating: 3.6, reviews: 156, price: 240, originalPrice: 260, discount: 20 },
  { id: '3', name: 'Checkered Shirt', image: 'https://s3-alpha-sig.figma.com/img/bbf4/11c2/5fc84f87eeac1062fbe47f49c192d4f2?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QB3LlOBw6XdqifXwkDQBs~n2mTOulcrIKH4DVvom3Jm5Z8317y6QCXhZW16hgp0QregOPSIHBisoHxkUvbmskP3cygKfsoVlUqVq2N~lZdoNY3s4AIxuJrQC4eebvDpGbt101uaBhrKTYXhDwOe1Q8kXnW-1lvVRedpQTb4~Hln-yxv3ohMHH3NmTMr9sQq-KoyeZoAGBESuGvCz--uyg73xQkuwlsOSJDmXo8hLSK9jp0Sakw1waPUgKEnwyegjQ1qKIPFhuCXZ1V9LEOoLxb5c2IkdcqWzocti7KdHdO~MX3UhdKaJdaI5cfQjn513P1p-Eyp9cPJWwgytuZXMOQ__', rating: 4.0, reviews: 420, price: 180 },
  { id: '4', name: 'Sleeve Striped T-shirt', image: 'https://s3-alpha-sig.figma.com/img/3457/42c2/7cc557f42cf1d489f7cc811856b90e9f?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oibsEAsthIhdRfYWblNCFprzHb88xr~1vQGsFxALXGPZ0RGdU1uN9IB4u538HyEFfWyQiVzX2-C6YuKl-8lO2NdQcqMzMEriUXXEteDbeIm~5E52RdPIHoLjRD6~9eWkBi9v-3QNBKndUuaWTH2V9DAKerqP-kZM-x350GoLxDm-G1poJlWpLtpl9oLK1VZvipPwIQKrV9YVa5ipBmtjGp2VC-f057Qbz2yZZtgTrWS9T-ElD9RhrmzMjqDwVT-wkoe8gy0JqAlMelDR9-XMS32mpA2b-pzBtIm9FIL5DObkwnMcBCfQeqP4PMx4E2B29aysqpimfDMBAxBACGP9dA__', rating: 4.5, reviews: 456, price: 130, originalPrice: 160, discount: 20 },
  { id: '5', name: 'Sleeve Striped T-shirt', image: 'https://s3-alpha-sig.figma.com/img/3457/42c2/7cc557f42cf1d489f7cc811856b90e9f?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oibsEAsthIhdRfYWblNCFprzHb88xr~1vQGsFxALXGPZ0RGdU1uN9IB4u538HyEFfWyQiVzX2-C6YuKl-8lO2NdQcqMzMEriUXXEteDbeIm~5E52RdPIHoLjRD6~9eWkBi9v-3QNBKndUuaWTH2V9DAKerqP-kZM-x350GoLxDm-G1poJlWpLtpl9oLK1VZvipPwIQKrV9YVa5ipBmtjGp2VC-f057Qbz2yZZtgTrWS9T-ElD9RhrmzMjqDwVT-wkoe8gy0JqAlMelDR9-XMS32mpA2b-pzBtIm9FIL5DObkwnMcBCfQeqP4PMx4E2B29aysqpimfDMBAxBACGP9dA__', rating: 4.5, reviews: 456, price: 130, originalPrice: 160, discount: 20 },
];

const topSelling = [
  { id: '6', name: 'Vertical Striped Shirt', image: 'https://s3-alpha-sig.figma.com/img/e01f/5d3c/d9029bd465a4c7158689ab1619693014?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=B23-uwOo6CzseOcW7KO28l1WY1fLHrha87AntSWV0haB94isI2TVsp7V7uhd80pGFaivJ5ix0A~41KyVUTGOJvQ3fWNF8ALLA1SYtRwPtOTk5Jh~yu57NU84Ajv4avbK~A7~QBIlwEQEgJr3RO7ipjbArTZAM7w1JVSnwRa2qTUGalwhla3Ny4L7ZUnCzxWAstTTn2d2YAv-14UkeLnIfpjXahx6cFuthDPtgHOMEsJ357-PrthgWzN6PG6W9oEEtdFl1M7TyWZJghOs~lWtKOnY9itYzoLIre9c4GaE-L3k4oJOhY9MQtzbVVAOFhVb21~PkF9z48rcaXKP9A4FcA__', rating: 4.0, reviews: 120, price: 212, originalPrice: 252, discount: 20 },
  { id: '7', name: 'Courage Graphic T-shirt', image: 'https://s3-alpha-sig.figma.com/img/5723/4b01/d5fcac5632cf6823570ca2d1d53d7d73?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=bXKB9O8yd~ROXrmtzZrNpKqpUyh2uN1qAneFc~KS7WKwQe08pafvyNxc~cQlswu~922WuX3qagdPjUlDKy552sLjbaykmDUQ0tLbaQZKkggzVv2APkm1EvbUS~~andI8wGeS2y7tX2zwp5uQQ63R6W7yDtYEZkDr8m6HoeTNIWPoDo8o-5k2VDFIRRMk-BR62YZ~2pHLqwgvR0T4RtWNJnRpB8V-qSshd7QEc2Je-jBz9n9tmOqOGonCtqsYaUEeLNdjyeocKv1NVgiHGI9zcFfAdlcaO-KRnkzwesJ7hys9ciSGHVEYZfPF~8mbcQzY2FfgQoaIbvSGGsDcv1ZP8g__', rating: 4.0, reviews: 140, price: 145 },
  { id: '8', name: 'Loose Fit Bermuda Shorts', image: 'https://s3-alpha-sig.figma.com/img/8951/5d71/4a66d9ca1401101dee4cc689f8bb5ad2?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QC520I9tQO5CToJRQieMD8oM2jsUM-cNUiBxap3ptY6YPkCCwugBv8HHkYGxnWItN7~97Y4rmZqcwa05H8QggaL0JCZChHfn9awRq~fIERiJdm5nMB0KPqewrPakCAxCOcTi~HfnNZqeG0JegAd9DP6uaJKANupSImAweyTevwnaKK2QlFjK9nFOZ57kmdMZrJPA3z4WOs~f5FHYW3KrvRE9fSTBRUWNu6TdC3gbPO43LZkzHncjTEyek1YfnqGFmykx-FdKRMNUX1G8-ExOd43qxHrN0O99qYeGbF8xs4vXTH0Y~lGj3Yc8zKIhBqCKi1F54oc98TjeO-8ePx9yxg__', rating: 3.0, reviews: 105, price: 80 },
  { id: '9', name: 'Faded Skinny Jeans', image: 'https://s3-alpha-sig.figma.com/img/f180/c768/08e2ff8a46be56aa933f031aed3abe75?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IqhHYK5T00XpEyjhQRHq~AHayoF26k5KPkWGMAOipQxUC-2eCkhs6asCJCruPvXs48wH0rIZfR~3vvcics-1nUvEuxWA6-FeYv6IfM52xHwFw8TZHI21e6hSMFOHZeUoohRK5EW8u04uzoIhpRz96xA-gijmpzoE4UtIyO1nIRIDlO~XhBqTXlau7TDNJO1FE3sepKyZPIeYSBXbjWzHAcrsYDeUjHYTqBoKNqv8Fgjf6zwTRnsFuzxoErZvazsTFZupqUY96LpUGA0nLsWHs-tZaAS8n5SSg99h7hWhlcqihnKDRm2MR0nUyq3coyYgLyb-p8fWcZo97VnycI~pXg__', rating: 4.5, reviews: 458, price: 210 },
  { id: '10', name: 'Faded Skinny Jeans', image: 'https://s3-alpha-sig.figma.com/img/8951/5d71/4a66d9ca1401101dee4cc689f8bb5ad2?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QC520I9tQO5CToJRQieMD8oM2jsUM-cNUiBxap3ptY6YPkCCwugBv8HHkYGxnWItN7~97Y4rmZqcwa05H8QggaL0JCZChHfn9awRq~fIERiJdm5nMB0KPqewrPakCAxCOcTi~HfnNZqeG0JegAd9DP6uaJKANupSImAweyTevwnaKK2QlFjK9nFOZ57kmdMZrJPA3z4WOs~f5FHYW3KrvRE9fSTBRUWNu6TdC3gbPO43LZkzHncjTEyek1YfnqGFmykx-FdKRMNUX1G8-ExOd43qxHrN0O99qYeGbF8xs4vXTH0Y~lGj3Yc8zKIhBqCKi1F54oc98TjeO-8ePx9yxg__', rating: 4.5, reviews: 458, price: 210 },
];

const testimonials = [
  {
    id: "1",
    name: "Sarah M.",
    verified: true,
    rating: 5,
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: "2",
    name: "Alex K.",
    verified: true,
    rating: 5,
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    id: "3",
    name: "James L.",
    verified: true,
    rating: 5,
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    id: "4",
    name: "Monet B.",
    verified: true,
    rating: 5,
    text: "The quality of clothing I've received from Shop.co has consistently impressed me. Their attention to detail and commitment to using premium materials sets them apart from other retailers.",
  },
];

const Example = () => {
  const [stats, setStats] = useState(bannerProps.stats);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => ({
          ...stat,
          value: stat.value + Math.floor(Math.random() * 8) + 3,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <BannerComponent {...bannerProps} stats={stats}/>
      <ProductSection title="New Arrivals" products={newArrivals} />
      <hr style={{ border: "1px solid #0000001A", width: "75%", margin: "auto" }} />
      <ProductSection title="Top Selling" products={topSelling} />
      <StyleBannerComponent />
      <TestimonialsCarousel testimonials={testimonials}/>
      <Footer />
    </div>
  );
};

export default Example;
