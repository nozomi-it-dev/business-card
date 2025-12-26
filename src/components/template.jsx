import "../styles/template.css";

const COMPANY_INFO = {
  name: "NOZOMI ENTERPRISE (THAILAND) CO.,LTD.",
  website: "www.nozomi-th.com",
  headOffice: {
    address: "382 M.4 Baanklongsuan Phrasamutjeidee Samutprakan 10290 Thailand.",
    tel: "+66 2 461 6288-89",
    fax: "+66 2 461 6292",
    gps: "https://goo.gl/maps/fVT5JCCGn1u",
  },
  branches: [
    {
      label: "Branch 1",
      address:
        "168 M.2 Baanklongsuan Phrasamutjeidee Samutprakan 10290 Thailand.",
    },
    {
      label: "Branch 2",
      address:
        "382/2 M.4 Baanklongsuan Phrasamutjeidee Samutprakan 10290 Thailand.",
    },
  ],
};

function Template({ data }) {
  const logoUrl = "/logo.png";
  const ursUrl = "/urs.png";

  return (
    <div className="template">
      <div className="card-header">
        <img
          src={logoUrl}
          alt="Nozomi Logo"
          className="logo"
          crossOrigin="anonymous"
        />
        <h1>{COMPANY_INFO.name}</h1>
      </div>

      <div className="card-body">
        <div className="info">
          <p className="name-th">{data?.full_name_th || "ชื่อ"}</p>
          <p className="name-en">{data?.full_name_en || "Name"}</p>
          <p className="positionn">{data?.position || "Position"}</p>
          <p>Mobile : {data?.tel || "000-000-0000"}</p>
          <p>E-mail : {data?.email || "example@email.com"}</p>
        </div>
        <img
          src={ursUrl}
          alt="URS Certificate"
          className="urs"
          crossOrigin="anonymous"
        />
      </div>

      <div className="card-footer">
        <div className="left">
          <p>
            <strong>Head office : </strong>
            {COMPANY_INFO.headOffice.address}
          </p>
          <div className="contact-group">
            <div className="colon sm">
              <p>Tel.</p>
              <span>:</span>
              <p>{COMPANY_INFO.headOffice.tel}</p>
            </div>
            <div className="colon sm">
              <p>Fax</p>
              <span>:</span>
              <p>{COMPANY_INFO.headOffice.fax}</p>
            </div>
            <div className="colon sm">
              <p>GPS</p>
              <span>:</span>
              <p>{COMPANY_INFO.headOffice.gps}</p>
            </div>
          </div>
          <p>{COMPANY_INFO.website}</p>
        </div>

        <div className="right">
          <p>
            <strong>{COMPANY_INFO.branches[0].label} : </strong>
            {COMPANY_INFO.branches[0].address}
          </p>
          <p>
            <strong>{COMPANY_INFO.branches[1].label} : </strong>
            {COMPANY_INFO.branches[1].address}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Template;
